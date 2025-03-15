import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Define fallback mappings for icons that might not be available in MaterialCommunityIcons
const iconMappings: Record<string, {set: string; name: string}> = {
  // Tab icons - primary using FontAwesome5 for reliability
  compass: {set: 'fontawesome5', name: 'compass'},
  heart: {set: 'fontawesome5', name: 'heart'},
  message: {set: 'fontawesome5', name: 'comment-alt'},
  account: {set: 'fontawesome5', name: 'user-circle'},

  // Navigation icons
  'arrow-left': {set: 'fontawesome5', name: 'arrow-left'},
  'chevron-right': {set: 'fontawesome5', name: 'chevron-right'},

  // Profile icons
  'account-circle': {set: 'fontawesome5', name: 'user-circle'},
  pencil: {set: 'fontawesome5', name: 'pen'},
  'account-edit': {set: 'fontawesome5', name: 'user-edit'},
  bullhorn: {set: 'fontawesome5', name: 'bullhorn'},
  cog: {set: 'fontawesome5', name: 'cog'},
  logout: {set: 'fontawesome5', name: 'sign-out-alt'},

  // Other icons
  cards: {set: 'fontawesome5', name: 'layer-group'},
  'account-group': {set: 'fontawesome5', name: 'users'},
  'currency-usd': {set: 'fontawesome5', name: 'dollar-sign'},
  'account-multiple': {set: 'fontawesome5', name: 'users'},
  'message-text': {set: 'fontawesome5', name: 'comment-dots'},
  domain: {set: 'fontawesome5', name: 'building'},
  web: {set: 'fontawesome5', name: 'globe'},

  // Fallbacks using FontAwesome
  'compass-fallback': {set: 'fontawesome', name: 'compass'},
  'heart-fallback': {set: 'fontawesome', name: 'heart'},
  'message-fallback': {set: 'fontawesome', name: 'comment'},
  'account-fallback': {set: 'fontawesome', name: 'user'},
  'settings-fallback': {set: 'fontawesome', name: 'cog'},

  // Fallbacks using Ionicons
  'compass-ion': {set: 'ionicons', name: 'compass'},
  'heart-ion': {set: 'ionicons', name: 'heart'},
  'message-ion': {set: 'ionicons', name: 'chatbubble'},
  'person-ion': {set: 'ionicons', name: 'person'},
};

interface CustomIconProps {
  name: string;
  size: number;
  color: string;
  style?: any;
}

const CustomIcon: React.FC<CustomIconProps> = ({name, size, color, style}) => {
  // First try to get the mapping
  const iconMapping = iconMappings[name];

  // If we have a mapping, use it
  if (iconMapping) {
    if (iconMapping.set === 'material') {
      return (
        <MaterialCommunityIcons
          name={iconMapping.name}
          size={size}
          color={color}
          style={style}
        />
      );
    } else if (iconMapping.set === 'fontawesome') {
      return (
        <FontAwesome
          name={iconMapping.name}
          size={size}
          color={color}
          style={style}
        />
      );
    } else if (iconMapping.set === 'ionicons') {
      return (
        <Ionicons
          name={iconMapping.name}
          size={size}
          color={color}
          style={style}
        />
      );
    } else if (iconMapping.set === 'fontawesome5') {
      return (
        <FontAwesome5
          name={iconMapping.name}
          size={size}
          color={color}
          style={style}
        />
      );
    }
  }

  // Try FontAwesome5 first (most reliable)
  try {
    return <FontAwesome5 name={name} size={size} color={color} style={style} />;
  } catch (error) {
    // Then try MaterialCommunityIcons
    try {
      return (
        <MaterialCommunityIcons
          name={name}
          size={size}
          color={color}
          style={style}
        />
      );
    } catch (error) {
      // If that fails, try FontAwesome
      try {
        return (
          <FontAwesome name={name} size={size} color={color} style={style} />
        );
      } catch (error) {
        // If all fails, use a default icon
        return (
          <FontAwesome
            name="question-circle"
            size={size}
            color={color}
            style={style}
          />
        );
      }
    }
  }
};

export default CustomIcon;
