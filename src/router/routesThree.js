import ThreeTwoOne from "@/views/ThreeTwoOne";

export default [
  {
    path: "three",
    name: "Three",
    component: { render: h => h("router-view") },
    meta: {
      nav: {
        icon: "el-icon-s-platform",
        title: "三级导航"
      }
    },
    children: [
      {
        path: "two",
        name: "ThreeTwo",
        component: { render: h => h("router-view") },
        meta: {
          nav: {
            title: "子导航"
          }
        },
        children: [
          {
            path: "one",
            name: "ThreeTwoOne",
            redirect: { name: "ThreeTwoOneSelf" },
            component: { render: h => h("router-view") },
            children: [
              {
                path: "",
                name: "ThreeTwoOneSelf",
                component: ThreeTwoOne,
                // permission: "",
                meta: {
                  title: "三级导航-子导航-子子导航",
                  nav: {
                    title: "子子导航"
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  }
];
