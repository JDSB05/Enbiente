import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
// Admin Imports
import MainDashboard from "./views/admin/default";
import Profile from "./views/admin/profile";
import Consumos from "./views/admin/consumos";
import UsersOverview from "./views/admin/utilizadores";

// Auth Imports
import SignInCentered from "./views/auth/signIn";

//

const routes = [
  {
    name: "Inicio",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Inicio",
    layout: "/user",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Consumos",
    layout: "/admin",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    path: "/consumos",
    component: Consumos,
  },
  {
    name: "Consumos",
    layout: "/user",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    path: "/consumos",
    component: Consumos,
  },
  {
    name: "Perfil",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    component: Profile,
  },
  {
    name: "Perfil",
    layout: "/user",
    path: "/profile",
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    component: Profile,
  },
  {
    name: "Utilizadores",
    layout: "/admin",
    path: "/utilizadores",
    icon: <Icon as={FaUserGroup} width='20px' height='20px' color='inherit' />,
    component: UsersOverview,
  },
];

export default routes;
