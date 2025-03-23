import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAuth} from '../../hooks/useAuth';
import {saveInstagramHandle} from '../../services/instagramService';
import {InfluencerProfile} from '../../types';

interface InstagramHandleInputProps {
  onSubmit?: () => void;
}

const InstagramHandleInput: React.FC<InstagramHandleInputProps> = ({
  onSubmit,
}) => {
  const {user, profile} = useAuth();
  const isInfluencer = profile?.type === 'influencer';
  const initialHandle = isInfluencer
    ? (profile as InfluencerProfile).instagramHandle || ''
    : '';

  const [handle, setHandle] = useState(initialHandle);
  const [isEditing, setIsEditing] = useState(!initialHandle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!handle.trim()) {
      setError('Please enter a valid Instagram handle');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (user?.uid) {
        await saveInstagramHandle(user.uid, handle.trim());
        setIsEditing(false);
        if (onSubmit) {
          onSubmit();
        }
      } else {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      setError('Failed to save Instagram handle');
      Alert.alert('Error', 'Failed to save Instagram handle');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Instagram Account</Text>
        {!isEditing && (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={styles.editButton}>
            <Icon name="pencil" size={18} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>

      {isEditing ? (
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.atSymbol}>@</Text>
            <TextInput
              style={styles.input}
              value={handle}
              onChangeText={setHandle}
              placeholder="Your Instagram handle"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.buttonContainer}>
            {initialHandle && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setHandle(initialHandle);
                  setIsEditing(false);
                }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={loading}>
              <Text style={styles.saveButtonText}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      ) : (
        <View style={styles.handleContainer}>
          <Icon name="instagram" size={24} color="#E1306C" />
          <Text style={styles.handleText}>@{handle}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  editButton: {
    padding: 8,
  },
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  atSymbol: {
    fontSize: 16,
    color: '#999999',
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  errorText: {
    color: '#FF4B6A',
    marginTop: 8,
    fontSize: 12,
  },
  handleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  handleText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333333',
  },
});

export default InstagramHandleInput;
