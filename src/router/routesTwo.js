import TwoOne from "@/views/TwoOne";

export default [
  {
    path: "two",
    name: "Two",
    component: { render: h => h("router-view") },
    meta: {
      nav: {
        svg: {
          class: "nav-svg",
          name: "homework"
        },
        title: "二级导航"
      }
    },
    children: [
      {
        path: "one",
        name: "TwoOne",
        redirect: { name: "TwoOneSelf" },
        component: { render: h => h("router-view") },
        children: [
          {
            path: "",
            name: "TwoOneSelf",
            component: TwoOne,
            // permission: "",
            meta: {
              title: "二级导航-子导航",
              nav: {
                title: "子导航"
              }
            }
          }
        ]
      }
    ]
  }
];
