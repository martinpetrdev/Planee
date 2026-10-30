// Created by AI (Claude Opus 5.5)

package dev.martinpetr.planee.module.jetpack

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.ui.ExpoUIView
import expo.modules.ui.ModifierRegistry

class PlaneeJetpackSwipeableModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("PlaneeJetpackSwipeable")

    OnCreate { registerVerticalScrollTo() }
    OnDestroy { ModifierRegistry.unregister(VERTICAL_SCROLL_TO) }

    ExpoUIView<PlaneeJetpackSwipeableComposeViewProps>("PlaneeJetpackSwipeableComposeView") {
      val onSwipeStartToEnd by Event<Unit>()
      val onSwipeEndToStart by Event<Unit>()

      Content { props ->
        PlaneeJetpackSwipeableComposeViewContent(
          props,
          onSwipeStartToEnd = { onSwipeStartToEnd(Unit) },
          onSwipeEndToStart = { onSwipeEndToStart(Unit) }
        )
      }
    }
  }
}
