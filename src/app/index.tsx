
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';

import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from 'react-native';

export default function Index() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');

  const [gender, setGender] = useState('');
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [country, setCountry] = useState('Rwanda');
  const [dob, setDob] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [satisfaction, setSatisfaction] = useState(5);
  const [favoriteColor, setFavoriteColor] = useState('');

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageName, setImageName] = useState('');
  const [documentName, setDocumentName] = useState('');

  const colors = {
    background: darkMode ? '#101827' : '#F3F6FB',
    card: darkMode ? '#1D2939' : '#FFFFFF',
    text: darkMode ? '#F9FAFB' : '#172033',
    muted: darkMode ? '#B7C2D0' : '#64748B',
    input: darkMode ? '#111C2E' : '#F8FAFC',
    border: darkMode ? '#43516A' : '#D9E2EF',
    primary: '#2563EB',
  };

  const showMessage = (messageText: string) => {
    if (Platform.OS === 'web') {
      window.alert(messageText);
    } else {
      Alert.alert('Registration Form', messageText);
    }
  };

  const toggleHobby = (hobby: string) => {
    setHobbies((current) =>
      current.includes(hobby)
        ? current.filter((item) => item !== hobby)
        : [...current, hobby]
    );
  };

  const takePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        showMessage(
          'Camera permission is required. Please allow camera access in your device settings.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        setImageName(result.assets[0].fileName || 'Camera photo');
      }
    } catch (error) {
      console.error('Camera error:', error);
      showMessage(
        'Could not open the camera. Try running the app on your Android phone using Expo Go.'
      );
    }
  };

  const chooseImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showMessage('Please allow access to your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        setImageName(result.assets[0].fileName || 'Selected image');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      showMessage('Could not open the image picker.');
    }
  };

  const chooseDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setDocumentName(result.assets[0].name);
      }
    } catch (error) {
      console.error('Document picker error:', error);
      showMessage('Could not open the document picker.');
    }
  };

  const handleSubmit = () => {
    const errors: string[] = [];

    if (!fullName.trim()) errors.push('Full name is required.');
    if (!email.includes('@')) errors.push('Enter a valid email address.');
    if (password.length < 6) {
      errors.push('Password must have at least 6 characters.');
    }
    if (!age || Number(age) <= 0) errors.push('Enter a valid age.');
    if (!phone.trim()) errors.push('Phone number is required.');
    if (!address.trim()) errors.push('Address is required.');
    if (!gender) errors.push('Please select a gender.');
    if (hobbies.length === 0) errors.push('Select at least one hobby.');
    if (!country) errors.push('Select a country.');
    if (!message.trim()) errors.push('Please enter a message.');
    if (!favoriteColor) errors.push('Select a favorite color.');
    if (!dob) errors.push('Please select your date of birth.');
    if (!imageUri) errors.push('Please choose an image or take a photo.');
    if (!documentName) errors.push('Please choose a document.');

    if (website.trim() && !/^https?:\/\/.+\..+/.test(website.trim())) {
      errors.push('Enter a valid website starting with http:// or https://.');
    }

    if (errors.length > 0) {
      showMessage(errors.join('\n'));
      return;
    }

    const formData = {
      fullName,
      email,
      password,
      age: Number(age),
      phone,
      address,
      dateOfBirth: dob?.toISOString().split('T')[0],
      gender,
      hobbies,
      country,
      notifications,
      darkMode,
      satisfaction,
      favoriteColor,
      website,
      message,
      imageName,
      imageUri,
      documentName,
    };

    console.log('FORM SUBMITTED SUCCESSFULLY');
    console.log('Form values:', formData);

    showMessage('Your form was submitted successfully!');
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setAge('');
    setPhone('');
    setAddress('');
    setMessage('');
    setWebsite('');
    setGender('');
    setHobbies([]);
    setCountry('Rwanda');
    setDob(null);
    setNotifications(true);
    setDarkMode(false);
    setSatisfaction(5);
    setFavoriteColor('');
    setImageUri(null);
    setImageName('');
    setDocumentName('');
    setShowDatePicker(false);
  };

  const fieldStyle = [
    styles.input,
    {
      backgroundColor: colors.input,
      color: colors.text,
      borderColor: colors.border,
    },
  ];

  const labelStyle = [styles.label, { color: colors.text }];

  const Section = ({
    title,
    subtitle,
    children,
  }: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
  }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {title}
      </Text>

      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          {subtitle}
        </Text>
      ) : null}

      {children}
    </View>
  );

  const RadioOption = ({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={styles.option}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
    >
      <View
        style={[
          styles.radioOuter,
          {
            borderColor: selected ? colors.primary : colors.muted,
          },
        ]}
      >
        {selected && <View style={styles.radioInner} />}
      </View>

      <Text style={[styles.optionText, { color: colors.text }]}>
        {label}
      </Text>
    </Pressable>
  );

  const CheckOption = ({
    label,
    checked,
    onPress,
  }: {
    label: string;
    checked: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={styles.option}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: checked ? colors.primary : 'transparent',
            borderColor: checked ? colors.primary : colors.muted,
          },
        ]}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>

      <Text style={[styles.optionText, { color: colors.text }]}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>PERSONAL INFORMATION</Text>
        <Text style={[styles.title, { color: colors.text }]}>
          Registration Form
        </Text>
        <Text style={[styles.headerDescription, { color: colors.muted }]}>
          Please complete the information below.
          Fields marked * are required.
        </Text>
      </View>

      <Section title="01  Personal details" subtitle="Tell us about yourself.">
        <Text style={labelStyle}>Full name *</Text>
        <TextInput
          style={fieldStyle}
          placeholder="Enter your full name"
          placeholderTextColor={colors.muted}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />

        <Text style={labelStyle}>Email address *</Text>
        <TextInput
          style={fieldStyle}
          placeholder="you@example.com"
          placeholderTextColor={colors.muted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={labelStyle}>Password * (minimum 6 characters)</Text>
        <TextInput
          style={fieldStyle}
          placeholder="Create a password"
          placeholderTextColor={colors.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={labelStyle}>Age *</Text>
        <TextInput
          style={fieldStyle}
          placeholder="Enter your age"
          placeholderTextColor={colors.muted}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <Text style={labelStyle}>Phone number *</Text>
        <TextInput
          style={fieldStyle}
          placeholder="+250 7XX XXX XXX"
          placeholderTextColor={colors.muted}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={labelStyle}>Address *</Text>
        <TextInput
          style={fieldStyle}
          placeholder="Enter your address"
          placeholderTextColor={colors.muted}
          value={address}
          onChangeText={setAddress}
        />

        <Text style={labelStyle}>Date of birth *</Text>

        {Platform.OS === 'web' ? (
          <TextInput
            style={fieldStyle}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.muted}
            value={dob ? dob.toISOString().split('T')[0] : ''}
            onChangeText={(value) => {
              if (!value) {
                setDob(null);
                return;
              }

              const parsed = new Date(`${value}T12:00:00`);

              if (
                /^\d{4}-\d{2}-\d{2}$/.test(value) &&
                !Number.isNaN(parsed.getTime()) &&
                parsed.toISOString().startsWith(value)
              ) {
                setDob(parsed);
              }
            }}
          />
        ) : (
          <>
            <Pressable
              style={[
                styles.input,
                styles.dateButton,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setShowDatePicker(!showDatePicker)}
            >
              <Text style={{ color: dob ? colors.text : colors.muted }}>
                {dob ? dob.toLocaleDateString() : 'Choose your date of birth'}
              </Text>
              <Text style={{ color: colors.primary }}>Select date</Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={dob || new Date(2005, 0, 1)}
                mode="date"
                maximumDate={new Date()}
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (event.type === 'set' && selectedDate) {
                    setDob(selectedDate);
                  }
                }}
              />
            )}
          </>
        )}

        <Text style={labelStyle}>Gender *</Text>
        <View style={styles.optionsContainer}>
          <RadioOption
            label="Male"
            selected={gender === 'Male'}
            onPress={() => setGender('Male')}
          />
          <RadioOption
            label="Female"
            selected={gender === 'Female'}
            onPress={() => setGender('Female')}
          />
          <RadioOption
            label="Other"
            selected={gender === 'Other'}
            onPress={() => setGender('Other')}
          />
          <RadioOption
            label="Prefer not to say"
            selected={gender === 'Prefer not to say'}
            onPress={() => setGender('Prefer not to say')}
          />
        </View>
      </Section>

      <Section title="02  Interests" subtitle="Select one or more hobbies.">
        <Text style={labelStyle}>Your hobbies *</Text>

        <View style={styles.optionsContainer}>
          {['Reading', 'Coding', 'Music', 'Sports', 'Travel', 'Drawing'].map(
            (hobby) => (
              <CheckOption
                key={hobby}
                label={hobby}
                checked={hobbies.includes(hobby)}
                onPress={() => toggleHobby(hobby)}
              />
            )
          )}
        </View>

        <Text style={labelStyle}>Country *</Text>
        <View
          style={[
            styles.pickerContainer,
            { borderColor: colors.border, backgroundColor: colors.input },
          ]}
        >
          <Picker
            selectedValue={country}
            onValueChange={setCountry}
            style={{ color: colors.text }}
          >
            <Picker.Item label="Rwanda" value="Rwanda" />
            <Picker.Item label="Uganda" value="Uganda" />
            <Picker.Item label="Kenya" value="Kenya" />
            <Picker.Item label="Tanzania" value="Tanzania" />
            <Picker.Item label="Burundi" value="Burundi" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <Text style={labelStyle}>Favorite color *</Text>
        <View style={styles.colorRow}>
          {[
            { name: 'Blue', hex: '#2563EB' },
            { name: 'Green', hex: '#16A34A' },
            { name: 'Red', hex: '#DC2626' },
            { name: 'Purple', hex: '#9333EA' },
            { name: 'Orange', hex: '#EA580C' },
          ].map((color) => (
            <Pressable
              key={color.name}
              onPress={() => setFavoriteColor(color.name)}
              style={[
                styles.colorOption,
                {
                  backgroundColor: color.hex,
                  borderWidth: favoriteColor === color.name ? 4 : 0,
                  borderColor: colors.text,
                },
              ]}
              accessibilityLabel={color.name}
              accessibilityRole="radio"
              accessibilityState={{ checked: favoriteColor === color.name }}
            />
          ))}
        </View>

        <Text style={{ color: colors.muted, marginTop: 8 }}>
          Selected: {favoriteColor || 'None'}
        </Text>
      </Section>

      <Section title="03  Preferences">
        <View style={styles.switchRow}>
          <View style={styles.switchTextContainer}>
            <Text style={[styles.optionText, { color: colors.text }]}>
              Email notifications
            </Text>
            <Text style={[styles.subtitle, { marginTop: 3 }]}>
              Receive updates by email
            </Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ true: colors.primary }}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchTextContainer}>
            <Text style={[styles.optionText, { color: colors.text }]}>
              Dark mode preference
            </Text>
            <Text style={[styles.subtitle, { marginTop: 3 }]}>
              Change the form appearance
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ true: colors.primary }}
          />
        </View>

        <Text style={labelStyle}>How satisfied are you? *</Text>
        <Text style={[styles.rating, { color: colors.primary }]}>
          {satisfaction} / 10
        </Text>
        <Slider
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={satisfaction}
          onValueChange={setSatisfaction}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primary}
        />
      </Section>

      <Section title="04  Files and photo" subtitle="Add an image and a document.">
        <Text style={labelStyle}>Your photo *</Text>

        {imageUri ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
            <Text
              style={[styles.fileName, { color: colors.text }]}
              numberOfLines={2}
            >
              {imageName || 'Selected image'}
            </Text>

            <Pressable onPress={() => {
              setImageUri(null);
              setImageName('');
            }}>
              <Text style={styles.removeText}>Remove photo</Text>
            </Pressable>
          </View>
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              { borderColor: colors.border, backgroundColor: colors.input },
            ]}
          >
            <Text style={{ fontSize: 30 }}>📷</Text>
            <Text style={[styles.optionText, { color: colors.text }]}>
              No photo selected
            </Text>
            <Text style={[styles.subtitle, { textAlign: 'center' }]}>
              Your selected image will appear here.
            </Text>
          </View>
        )}

        <View style={styles.fileButtonRow}>
          <Pressable
            onPress={chooseImage}
            style={[styles.secondaryButton, { borderColor: colors.primary }]}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
              Choose Image
            </Text>
          </Pressable>

          {Platform.OS !== 'web' && (
            <Pressable
              onPress={takePhoto}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Take Photo</Text>
            </Pressable>
          )}
        </View>

        {Platform.OS === 'web' && (
          <Text style={[styles.subtitle, { marginTop: 8 }]}>
            To use your phone camera, open this app in Expo Go on your phone.
          </Text>
        )}

        <Text style={labelStyle}>Document *</Text>

        <Pressable
          onPress={chooseDocument}
          style={[
            styles.documentButton,
            { borderColor: colors.border, backgroundColor: colors.input },
          ]}
        >
          <Text style={{ fontSize: 22 }}>📄</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.optionText, { color: colors.text }]}>
              {documentName || 'Choose a document'}
            </Text>
            <Text style={[styles.subtitle, { marginTop: 3 }]}>
              Tap to browse your files
            </Text>
          </View>
          <Text style={{ color: colors.primary }}>Browse</Text>
        </Pressable>
      </Section>

      <Section title="05  Additional information">
        <Text style={labelStyle}>Website (optional)</Text>
        <TextInput
          style={fieldStyle}
          placeholder="https://example.com"
          placeholderTextColor={colors.muted}
          value={website}
          onChangeText={setWebsite}
          keyboardType="url"
          autoCapitalize="none"
        />

        <Text style={labelStyle}>Message *</Text>
        <TextInput
          style={[fieldStyle, styles.multilineInput]}
          placeholder="Write something about yourself..."
          placeholderTextColor={colors.muted}
          value={message}
          onChangeText={setMessage}
          multiline
          textAlignVertical="top"
        />
      </Section>

      <View style={styles.actions}>
        <Pressable onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitText}>Submit Registration</Text>
        </Pressable>

        <Pressable
          onPress={resetForm}
          style={[
            styles.resetButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.resetText, { color: colors.text }]}>
            Reset Form
          </Text>
        </Pressable>

        <Text style={[styles.footer, { color: colors.muted }]}>
          Please check your information before submitting.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 48,
    maxWidth: 760,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 22,
    paddingHorizontal: 4,
  },
  eyebrow: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 15,
    lineHeight: 23,
  },
  card: {
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5EAF2',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 120,
    paddingTop: 13,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionsContainer: {
    gap: 5,
    marginTop: 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 4,
    minHeight: 42,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 18,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  colorOption: {
    width: 37,
    height: 37,
    borderRadius: 20,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 12,
  },
  switchTextContainer: {
    flex: 1,
  },
  rating: {
    fontSize: 20,
    fontWeight: '800',
  },
  imagePlaceholder: {
    minHeight: 145,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 8,
  },
  previewContainer: {
    alignItems: 'flex-start',
    gap: 8,
  },
  previewImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  fileName: {
    fontSize: 13,
  },
  removeText: {
    color: '#DC2626',
    fontWeight: '700',
    paddingVertical: 5,
  },
  fileButtonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginTop: 2,
  },
  actions: {
    gap: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  resetButton: {
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 13,
  },
  resetText: {
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
});
