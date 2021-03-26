import Layout from '@/layout'
const Cockpit = [
  {
    path: '/Xxxx',
    component: Layout,
    meta: { title: '会议管理' },
    children: [
      {
        path: 'test1',
        component: () => import('@/views/meetingmanagement/meeting'),
        name: 'Meeting',
        meta: { title: '我的会议' }
      },
      {
        path: 'test2',
        component: () => import('@/views/meetingmanagement/meetingEditor'),
        name: 'MeetingEditor',
        meta: { title: '会议编辑' }
      },
      {
        path: 'test3',
        component: () => import('@/views/meetingmanagement/addMeeting'),
        name: 'AddMeeting',
        meta: { title: '添加会议' }
      }
    ]
  }
]

export default Cockpit
