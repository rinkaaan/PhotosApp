import { Alert, AppLayout, Box, Button, Flashbar, Modal, SideNavigation, SideNavigationProps, SpaceBetween } from "@cloudscape-design/components"
import { Navigate, Outlet, UIMatch, useLocation, useMatches, useNavigate } from "react-router-dom"
import { Fragment, useEffect, useState } from "react"
import CloudBreadcrumbGroup from "../components/CloudBreadcrumbGroup"
import { useSelector } from "react-redux"
import { mainActions, mainSelector, prepareNotifications } from "./mainSlice"
import { appDispatch } from "../common/store"
import { CrumbHandle } from "../App"

const items: SideNavigationProps.Item[] = [
  {
    type: "link",
    text: "Home",
    href: "/home",
  },
  {
    type: "link",
    text: "Settings",
    href: "/settings",
  },
]

export function getCrumbs(matches: UIMatch<string, CrumbHandle>[]) {
  return matches
    .filter((match) => Boolean(match.handle?.crumbs))
    .map((match) => match.handle.crumbs())
}

export function BreadCrumbs() {
  const matches = useMatches() as UIMatch<string, CrumbHandle>[]
  const crumbs = getCrumbs(matches).map((crumb) => {
    return {
      text: crumb.crumb,
      href: crumb.path,
    }
  })
  const showCrumbs = crumbs.length > 1

  return (
    <div style={{ opacity: showCrumbs ? 1 : 0, pointerEvents: showCrumbs ? "auto" : "none" }}>
      <CloudBreadcrumbGroup items={crumbs}/>
    </div>
  )
}

export default function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const matches = useMatches() as UIMatch<string, CrumbHandle>[]
  const crumbs = getCrumbs(matches)
  const [activeHref, setActiveHref] = useState<string | undefined>(undefined)
  const { engineReady, navigationOpen, notifications, dirty, dirtyModalVisible, dirtyRedirectUrl, startingPath } = useSelector(mainSelector)

  useEffect(() => {
    if (startingPath) {
      navigate(startingPath)
    }
  }, [])

  useEffect(() => {
    // Go from last to first crumb, set activeHref to the first one that matches items
    for (const crumb of crumbs.reverse()) {
      if (crumb.path == null) continue
      if (items.find(item => item["href"] === crumb.path)) {
        setActiveHref(crumb.path)
        break
      }
    }
  }, [crumbs])

  if (location.pathname === "/") {
    return <Navigate to="/home" replace/>
  } else {
    return (
      <Fragment>
        <AppLayout
          navigation={
            <SideNavigation
              header={{
                text: "Photos",
                href: "/home",
              }}
              onFollow={e => {
                e.preventDefault()
                if (!dirty) {
                  navigate(e.detail.href)
                } else {
                  let dirtyRedirectUrl = e.detail.href
                  appDispatch(mainActions.updateSlice({ dirtyModalVisible: true, dirtyRedirectUrl }))
                }
              }}
              activeHref={activeHref}
              items={items}
            />
          }
          navigationOpen={navigationOpen}
          onNavigationChange={(e) => {
            appDispatch(mainActions.updateSlice({ navigationOpen: e.detail.open }))
          }}
          content={<Outlet/>}
          breadcrumbs={<BreadCrumbs/>}
          notifications={
            <Flashbar items={prepareNotifications(notifications)}/>
          }
          toolsHide
        />
        <Modal
          visible={dirtyModalVisible}
          header="Leave page"
          closeAriaLabel="Close modal"
          onDismiss={() => {
            appDispatch(mainActions.updateSlice({ dirtyModalVisible: false }))
          }}
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button
                  variant="link"
                  onClick={() => {
                    appDispatch(mainActions.updateSlice({ dirtyModalVisible: false }))
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (dirtyRedirectUrl) {
                      navigate(dirtyRedirectUrl)
                    } else {
                      navigate("/")
                    }
                  }}
                >
                  Leave
                </Button>
              </SpaceBetween>
            </Box>
          }
        >
          <Alert type="warning" statusIconAriaLabel="Warning">
            Are you sure that you want to leave the current page? The changes that you made won't be saved.
          </Alert>
        </Modal>
      </Fragment>
    )
  }
}