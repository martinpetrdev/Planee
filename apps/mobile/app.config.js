const IS_DEV = process.env.APP_ENV === "development";

const commit = (process.env.EAS_BUILD_GIT_COMMIT_HASH ?? "<local>").slice(0, 7);
const channel =
  process.env.EAS_BUILD_PROFILE || (IS_DEV ? "development" : "production");

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
    android: {
      package: packageName,
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
      adaptiveIcon: {
        backgroundColor: "#FFFFFF",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#FFFFFF",
          image: "./assets/images/splash-light.png",
          imageWidth: 128,
          dark: {
            backgroundColor: "#121318",
            image: "./assets/images/splash-dark.png",
          },
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
      commit,
      channel,
      router: {},
      eas: {
        projectId: "650cdf1d-9bd2-44ff-8a06-4e012822d213",
      },
    },
    owner: "martingames",
  },
};
