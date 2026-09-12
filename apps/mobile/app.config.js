const IS_DEV = process.env.APP_ENV === "development";

const packageName = IS_DEV
  ? "dev.martinpetr.planee.devel"
  : "dev.martinpetr.planee";
const scheme = IS_DEV ? "planee-dev" : "planee";

export default {
  expo: {
    name: "Planee" + (IS_DEV ? " (DEV)" : ""),
    slug: "planee",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: scheme,
    userInterfaceStyle: "automatic",
    ios: {
      icon: "./assets/expo.icon",
    },
    android: {
      package: packageName,
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#208AEF",
          image: "./assets/images/splash-icon.png",
          imageWidth: 76,
        },
      ],
      "expo-status-bar",
      "expo-font",
      "expo-image",
      "expo-web-browser",
      "expo-secure-store",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "650cdf1d-9bd2-44ff-8a06-4e012822d213",
      },
    },
    owner: "martingames",
  },
};
