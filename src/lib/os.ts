import * as isOs from 'isos'

export const checkOS = {
  mac: isOs('mac'),
  darwin: isOs('darwin'),
  osx: isOs('osx'),
  windows: isOs('windows'),
  linux: isOs('linux'),
}
