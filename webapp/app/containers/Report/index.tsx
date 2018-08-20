/*
 * <<
 * Davinci
 * ==
 * Copyright (C) 2016 - 2017 EDP
 * ==
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * >>
 */

import * as React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import Sidebar from '../../components/Sidebar'
import SidebarOption from '../../components/SidebarOption/index'
import { selectSidebar } from './selectors'
import { loadSidebar } from './actions'
import { makeSelectLoginUser } from '../App/selectors'
import { showNavigator } from '../App/actions'
import {loadProjectDetail} from '../Projects/actions'
import reducer from '../Projects/reducer'
import injectReducer from 'utils/injectReducer'
import saga from '../Projects/sagas'
import injectSaga from 'utils/injectSaga'
import {compose} from 'redux'
const styles = require('./Report.less')

interface IReportProps {
  sidebar: boolean | any[]
  loginUser: { admin: boolean }
  routes: any[]
  params: any
  children: React.ReactNode
  onPageLoad: () => any
  onShowNavigator: () => any
  onLoadProjectDetail: (id) => any
}

export class Report extends React.Component<IReportProps, {}> {

  public componentDidMount () {
    const { pid } = this.props.params
    this.props.onPageLoad()
    this.props.onShowNavigator()
    if (pid) {
      console.log(pid)
      this.props.onLoadProjectDetail(pid)
    }
  }

  public render () {
    const {
      sidebar,
      loginUser,
      routes
    } = this.props
    const sidebarOptions = sidebar && (sidebar as any[]).map((item) => {
      const isOptionActive = item.route.indexOf(routes[3].name) >= 0
      const iconClassName = `iconfont ${item.icon}`
      return (
        <SidebarOption
          key={item.route}
          route={item.route}
          active={isOptionActive}
          params={this.props.params}
        >
          <i className={iconClassName} />
        </SidebarOption>
      )
    })

    const sidebarComponent = loginUser.admin
      ? (
        <Sidebar>
          {sidebarOptions}
        </Sidebar>
      ) : ''

    return (
      <div className={styles.report}>
        {sidebarComponent}
        <div className={styles.container}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  sidebar: selectSidebar(),
  loginUser: makeSelectLoginUser()
})

export function mapDispatchToProps (dispatch) {
  return {
    onPageLoad: () => {
      const sidebarSource = [
        { icon: 'icon-dashboard', route: ['vizs'] },
        { icon: 'icon-widget-gallery', route: ['widgets'] },
        { icon: 'icon-custom-business', route: ['bizlogics', 'bizlogic'] },
        { icon: 'icon-datasource24', route: ['sources'] },
        // { icon: 'icon-user1', route: ['users'] },
        // { icon: 'icon-group', route: ['groups'] },
        { icon: 'anticon anticon-clock-circle-o', route: ['schedule'] }
      ]
      dispatch(loadSidebar(sidebarSource))
    },
    onLoadProjectDetail: (id) => dispatch(loadProjectDetail(id)),
    onShowNavigator: () => dispatch(showNavigator())
  }
}

const withReducer = injectReducer({ key: 'project', reducer })
const withSaga = injectSaga({ key: 'project', saga })
const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withReducer,
  withSaga,
  withConnect
)(Report)
