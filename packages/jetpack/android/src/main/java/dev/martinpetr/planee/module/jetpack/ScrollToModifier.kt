// Created by AI (Claude Opus 5.5)

package dev.martinpetr.planee.module.jetpack

import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import expo.modules.ui.ModifierRegistry

const val VERTICAL_SCROLL_TO = "planeeVerticalScrollTo"

// Like expo-ui's verticalScroll, but centers `offset` (dp) in the viewport every time `request` changes (0 = no scroll)
fun registerVerticalScrollTo() {
  ModifierRegistry.register(VERTICAL_SCROLL_TO) { map, _, _, _ ->
    val state = rememberScrollState()
    val density = LocalDensity.current
    val offset = map["offset"]?.asDouble() ?: 0.0
    val request = map["request"]?.asInt() ?: 0

    LaunchedEffect(request) {
      if (request > 0) {
        state.animateScrollTo(with(density) { offset.dp.roundToPx() } - state.viewportSize / 2)
      }
    }

    Modifier.verticalScroll(state)
  }
}
