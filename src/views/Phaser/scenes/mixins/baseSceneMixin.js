import Phaser from 'phaser';

import variables from '../../managers/Variables'
import { sharedInstance as events } from '../../managers/EventCenter'

let baseSceneMixin = {
  toggleMusic() {
    if (variables.musicEnabled) {
      this.backgroundmusic.stop()
      variables.musicEnabled = false
    } else {
      this.backgroundmusic.play({ loop: true })
      variables.musicEnabled = true
    }
  },

  getMusicEnabled() {
    return variables.musicEnabled
  },

  playBackgroundMusic() {
    if(variables.musicEnabled)
      this.backgroundmusic.play({ loop: true })
  },

  getRandInt(max) {
    return Math.floor(Math.random()*max)
  },

  // Due to limitations with Phaser garbage collection I need to nuke everything
  nukeItAll() {
    this.backgroundmusic.stop()
    this.physics.world.bodies.iterate((obj) => {
      obj.destroy()
    })
    events.eventNames().forEach((event) => {
        events.removeAllListeners(event)
    })
  },
}

export default baseSceneMixin