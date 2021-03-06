import React, {PropTypes, Component} from 'react';
import {View, Text, Platform, ToolbarAndroid, Image, ActionSheetIOS} from 'react-native';

import s from '../styles/components/Toolbar'

import Button from './Button'

class Toolbar extends Component {
  constructor(props) {
    super(props)

    this.renderNavIcon = this.renderNavIcon.bind(this)
    this.renderCenter = this.renderCenter.bind(this)
    this.handleOverflowClick = this.handleOverflowClick.bind(this)
    this.renderRight = this.renderRight.bind(this)
  }

  handleOverflowClick() {
    const {actions, onActionSelected} = this.props

    if (!actions) {
      return
    }

    console.log('ACTIONS!!!', actions)

    const newActions = actions.map(({title, show}, index) => {
      if (show === 'never') {
        return {
          index,
          title
        }
      }
    }).filter(item => !!item)

    console.log('newActions', newActions)
    const options = {
      options: newActions.map(({title}) => title).concat('Close'),
      cancelButtonIndex: newActions.length,
      title: this.props.title
    }

    ActionSheetIOS.showActionSheetWithOptions(
      options,
      index => index === newActions.length
        ? () => {}
        : onActionSelected(newActions[index].index)
    )
  }

  renderIcon(index, icon, onPress) {
    return (
      <Button
        onPress={() => onPress(index)}
        style={[s.iconButton, s.showIcon]}>
        <Image
          style={s.icon}
          source={icon} />
      </Button>
    )
  }

  renderNavIcon() {
    const {onIconClicked, navIcon} = this.props
    return (
      <Button onPress={onIconClicked} style={s.iconButton}>
        <Image
          style={s.icon}
          source={navIcon} />
      </Button>
    )
  }

  renderRight() {
    const {actions, onActionSelected, overflowIcon} = this.props

    if (!actions) {
      return <View style={s.iconButton} />
    }
    const icons = actions.map((item, index) => {
      if (item.show === 'always') {
        return this.renderIcon(index, item.icon, onActionSelected)
      }
    })

    const showOverflowIcon = actions.filter(item => item.show !== 'always').length > 0

    return (
      <View style={s.addContainer}>
        {icons}
        {showOverflowIcon && (
          <Button onPress={this.handleOverflowClick} style={s.iconButton}>
            <Image
              style={s.icon}
              source={overflowIcon} />
          </Button>
        )}
      </View>
    )
  }

  renderCenter() {
    const {children, title} = this.props
    if (!!children) {
      return (
        <View style={s.childrenContainer}>
          {children}
        </View>
      )
    }

    return (
      <View style={s.titleContainer}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={s.title}>
          {title}
        </Text>
      </View>
    )
  }

  render() {
    const {
      title,
      titleColor,
      navIcon,
      onIconClicked,
      actions,
      onActionSelected,
      overflowIcon,
      children,
      style
    } = this.props
    return (
      <View style={[style, s.container]}>
        {this.renderNavIcon()}
        {this.renderCenter()}
        {this.renderRight()}
      </View>
    )
  }
}

Toolbar.propTypes = {
  title: PropTypes.string,
  navIcon: PropTypes.element,
  onNavIconPress: PropTypes.func,
  additionalIcon: PropTypes.element,
  additionalIconTitle: PropTypes.string,
  onAdditionalIconPress: PropTypes.func,
  children: React.PropTypes.any,
  style: PropTypes.object
}

export default Platform.OS === 'ios' ? Toolbar : ToolbarAndroid
