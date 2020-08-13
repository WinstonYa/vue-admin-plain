import routesHome from "./routesHome";
import routesTwo from "./routesTwo";
import routesThree from "./routesThree";

import TheLayout from "@/components/TheLayout.vue";

export default [
  {
    path: "/",
    component: TheLayout,
    redirect: { name: "Home" },
    children: [...routesHome, ...routesTwo, ...routesThree]
  }
];
