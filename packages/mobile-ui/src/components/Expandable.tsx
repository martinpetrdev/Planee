import {
	AnimatedVisibility,
	EnterTransition,
	ExitTransition,
	useMaterialColors,
} from "@expo/ui/jetpack-compose";
import { type PropsWithChildren, useState } from "react";
import type { IconType } from "../icons/icons";
import { Card } from "./core/Card";
import { Column } from "./core/Column";
import { Icon } from "./core/Icon";
import { Row } from "./core/Row";
import { Text } from "./core/Text";

interface IExpandableProps extends PropsWithChildren {
	title: string;
	icon?: IconType;
}

export function Expandable(props: IExpandableProps) {
	const [expanded, setExpanded] = useState(false);
	const colors = useMaterialColors();

	return (
		<Card fillWidth borderRadius={12} onClick={() => setExpanded(!expanded)}>
			<Row padding={16} gap={16} verticalAlignment="center">
				{props.icon && <Icon name={props.icon} color={colors.primary} />}
				<Column flex>
					<Text typography="titleSmall">{props.title}</Text>
				</Column>
				<Icon
					name="keyboard_arrow_down"
					color={colors.onSurfaceVariant}
					styles={{ rotation: expanded ? 180 : 0 }}
				/>
			</Row>
			<AnimatedVisibility
				visible={expanded}
				// Created by Claude Code (Claude Opus 5.5)
				enterTransition={EnterTransition.expandVertically().plus(
					EnterTransition.fadeIn(),
				)}
				exitTransition={ExitTransition.shrinkVertically().plus(
					ExitTransition.fadeOut(),
				)}
			>
				<Column paddingLeft={16} paddingRight={16} paddingBottom={16}>
					{props.children}
				</Column>
			</AnimatedVisibility>
		</Card>
	);
}
