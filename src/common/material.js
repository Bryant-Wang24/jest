import { EncodeURIFilter } from '@/utils/common'
export const DIALOG_TYPE = {
  ADD: {
    title: '新建文件夹',
    type: 'ADD'
  },
  RENAME: {
    title: '重命名',
    type: 'RENAME'
  },
  PERMISSION: {
    title: '权限管理',
    type: 'PERMISSION'
  },
  DELETE: {
    title: '',
    type: 'DELETE'
  },
  APPLY: {
    title: '下载文件',
    type: 'APPLY'
  },
  VIEW: {
    title: '查看详情',
    type: 'VIEW'
  }
}

export const TYPE = {
  FOLDER: 'FOLDER',
  FILE: 'FILE'
}
// export const COMMAND_FUNC = {
//   RENAME: 'rename',
//   PERMISSION: 'permission',
//   DELETE: 'delete'
// }

export const LIST_STYLE = {
  BLOCK: 'BLOCK',
  LIST: 'LIST'
}

export const PERMISSION = {
  'MANAGE': '0', // 管理、分配结点的权限，相当于全部权限
  'CREATE_FILE': '1', // 文件创建
  'CREATE_FOLDER': '2', // 文件夹创建
  'DELETE': '3', // 删除
  'RENAME': '4', // 重命名
  'EDIT': '5', // 编辑
  'VIEW': '6', // 查看
  'UPLOAD': '7', // 上传
  'DIRECTLY_DOWNLOAD': '8', // 直接下载
  'APPLY_TO_DOWNLOAD': '9', // 需申请下载的下载
  'COPY_INTERNAL': '10' // 内部复制
}

export const PERMISSION_OBJECT = {
  'MANAGE': 'MANAGE',
  'CREATE_FILE': 'CREATE_FILE',
  'CREATE_FOLDER': 'CREATE_FOLDER',
  'DELETE': 'DELETE',
  'RENAME': 'RENAME',
  'EDIT': 'EDIT',
  'VIEW': 'VIEW',
  'UPLOAD': 'UPLOAD',
  'DIRECTLY_DOWNLOAD': 'DIRECTLY_DOWNLOAD',
  'APPLY_TO_DOWNLOAD': 'APPLY_TO_DOWNLOAD',
  'COPY_INTERNAL': 'COPY_INTERNAL'
}

export const DOWNLOAD_TYPE = {
  SINGLE: 'SINGLE', // 单个文件下载
  MULTIPLE: 'MULTIPLE' // 顶部多选按钮下载
}

export const images = {
  folderImage: require('@/assets/gongge_images/file.png'),
  docx: require('@/assets/gongge_images/word.png'),
  doc: require('@/assets/gongge_images/word.png'),
  pdf: require('@/assets/gongge_images/pdf.png'),
  ppt: require('@/assets/gongge_images/ppt.png'),
  pptx: require('@/assets/gongge_images/ppt.png'),
  mp3: require('@/assets/gongge_images/mp3.png'),
  mp4: require('@/assets/gongge_images/mp3.png'),
  rar: require('@/assets/gongge_images/compress.png'),
  zip: require('@/assets/gongge_images/compress.png'),
  arj: require('@/assets/gongge_images/compress.png'),
  txt: require('@/assets/gongge_images/txt.png'),
  xlsx: require('@/assets/gongge_images/excel.png'),
  unknown: require('@/assets/gongge_images/unknown.png')
}

export const pictureType = ['png', 'gif', 'jpg']

export const getImage = (nodeType, url) => {
  if (pictureType.includes(nodeType)) {
    return EncodeURIFilter(url || '')
  }
  return images[nodeType] || images['unknown']
}
