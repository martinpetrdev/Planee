// Partially written by Claude Code (Claude Opus 5.5)

package dev.martinpetr.nglyph

import android.content.ComponentName
import android.os.Build
import com.nothing.ketchum.Common
import com.nothing.ketchum.Glyph
import com.nothing.ketchum.GlyphException
import com.nothing.ketchum.GlyphFrame
import com.nothing.ketchum.GlyphManager
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NothingGlyphModule : Module() {
  private var manager: GlyphManager? = null
  private var connecting = false
  private var reopenOnForeground = false
  private val pending = mutableListOf<Promise>()

  private val device: String? get() = when {
    Build.VERSION.SDK_INT < 34 -> null
    Common.is20111() -> Glyph.DEVICE_20111
    Common.is22111() -> Glyph.DEVICE_22111
    Common.is23111() -> Glyph.DEVICE_23111
    Common.is23113() -> Glyph.DEVICE_23113
    Common.is24111() -> Glyph.DEVICE_24111
    Common.is25111() -> Glyph.DEVICE_25111
    Common.is25131() -> Glyph.DEVICE_25131
    else -> null
  }

  private val deviceName: String get() = when {
    Build.VERSION.SDK_INT < 34 -> "NULL"
    Common.is20111() -> "20111"
    Common.is22111() -> "22111"
    Common.is23111() -> "23111"
    Common.is23113() -> "23113"
    Common.is24111() -> "24111"
    Common.is25111() -> "25111"
    Common.is25131() -> "25131"
    else -> "NULL"
  }

  override fun definition() = ModuleDefinition {
    Name("NothingGlyph")

    Function("isSupported") {
      device != null
    }

    Function("deviceName") {
      deviceName
    }

    AsyncFunction("open") {
      promise: Promise ->
        if (manager != null) return@AsyncFunction promise.resolve(null)
        if (device == null) return@AsyncFunction promise.reject("ERR_GLYPH_UNSUPPORTED", "Not a supported Nothing device", null)

        synchronized(this@NothingGlyphModule) { pending.add(promise) }
        connect()
    }

    Function("toggle") {
      channels: List<Int> -> manager?.toggle(frame(channels))
    }

    Function("animate") {
      channels: List<Int>, period: Int?, cycles: Int?, interval: Int? ->
        val b = requireNotNull(manager) { "Call open() first" }.glyphFrameBuilder

      channels.forEach { b.buildChannel(it) }
      period?.let(b::buildPeriod);
      cycles?.let(b::buildCycles);
      interval?.let(b::buildInterval);

      manager?.animate(b.build())
    }

    Function("displayProgress") {
      channels: List<Int>, progress: Int, reverse: Boolean? ->
        manager?.displayProgress(frame(channels), progress, reverse ?: false)
    }

    Function("turnOff") {
      manager?.turnOff()
    }
    Function("close") {
      close()
    }

    OnActivityEntersBackground {
      reopenOnForeground = manager != null || connecting
      close()
    }
    OnActivityEntersForeground {
      if (reopenOnForeground) connect()
      reopenOnForeground = false
    }
    OnDestroy {
      close()
    }
  }

  private fun frame(channels: List<Int>): GlyphFrame {
    val builder = requireNotNull(manager) { "Call open() first" }.glyphFrameBuilder
    channels.forEach { builder.buildChannel(it) }

    return builder.build()
  }

  // All open() callers share one connection attempt, the SDK manager is a singleton
  @Synchronized
  private fun connect() {
    if (manager != null || connecting) return
    val target = device ?: return
    connecting = true

    val glyphManager = GlyphManager.getInstance(appContext.reactContext!!.applicationContext)
    glyphManager.init(object : GlyphManager.Callback {
      override fun onServiceConnected(name: ComponentName?) {
        synchronized(this@NothingGlyphModule) {
          if (!connecting) return // closed while connecting, or a reconnect
          connecting = false

          try {
            glyphManager.register(target)
            glyphManager.openSession()
            manager = glyphManager
            settle { it.resolve(null) }
          } catch (e: GlyphException) {
            glyphManager.unInit()
            settle { it.reject("ERR_GLYPH_SESSION", e.message, e) }
          }
        }
      }

      override fun onServiceDisconnected(name: ComponentName?) {
        manager = null
      }
    })
  }

  private fun settle(action: (Promise) -> Unit) {
    pending.forEach(action)
    pending.clear()
  }

  @Synchronized
  private fun close() {
    if (connecting) {
      connecting = false
      settle { it.reject("ERR_GLYPH_CLOSED", "Closed before the service connected", null) }
      GlyphManager.getInstance(appContext.reactContext!!.applicationContext).unInit()
      return
    }

    val glyphManager = manager ?: return
    manager = null

    try {
      glyphManager.closeSession()
    } catch(_: GlyphException) {}
    glyphManager.unInit()
  }
}

