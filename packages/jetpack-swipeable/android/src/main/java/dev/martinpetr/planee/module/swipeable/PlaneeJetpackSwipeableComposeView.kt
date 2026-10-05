// Created by AI (Claude Opus 5.5)

package dev.martinpetr.planee.module.swipeable

import androidx.compose.material3.SwipeToDismissBox
import androidx.compose.material3.SwipeToDismissBoxValue
import androidx.compose.material3.rememberSwipeToDismissBoxState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.FunctionalComposableScope
import expo.modules.ui.ModifierList
import expo.modules.ui.ModifierRegistry
import expo.modules.ui.UIComposableScope
import expo.modules.ui.findChildSlotView
import expo.modules.ui.isSlotView
import expo.modules.ui.renderSlot
import kotlinx.coroutines.launch

data class PlaneeJetpackSwipeableComposeViewProps(
  @Field val modifiers: ModifierList = emptyList()
) : ComposeProps

@Composable
fun FunctionalComposableScope.PlaneeJetpackSwipeableComposeViewContent(
  props: PlaneeJetpackSwipeableComposeViewProps,
  onSwipeStartToEnd: () -> Unit,
  onSwipeEndToStart: () -> Unit
) {
  val startToEnd = findChildSlotView(view, "startToEnd")
  val endToStart = findChildSlotView(view, "endToStart")
  val state = rememberSwipeToDismissBoxState()
  val scope = rememberCoroutineScope()

  SwipeToDismissBox(
    state = state,
    modifier = ModifierRegistry.applyModifiers(props.modifiers, appContext, composableScope, globalEventDispatcher),
    // A direction is enabled only when JS passes a background for it
    enableDismissFromStartToEnd = startToEnd != null,
    enableDismissFromEndToStart = endToStart != null,
    backgroundContent = {
      when (state.dismissDirection) {
        SwipeToDismissBoxValue.StartToEnd -> startToEnd?.renderSlot()
        SwipeToDismissBoxValue.EndToStart -> endToStart?.renderSlot()
        else -> {}
      }
    },
    onDismiss = { direction ->
      if (direction == SwipeToDismissBoxValue.StartToEnd) onSwipeStartToEnd() else onSwipeEndToStart()
      // Snap back: the list item stays in place and React re-renders it with the new state
      scope.launch { state.reset() }
    }
  ) {
    Children(UIComposableScope(), filter = { !isSlotView(it) })
  }
}
