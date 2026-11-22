import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Easing,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { colors } from '../../theme';

const PANEL_W = Math.min(420, Dimensions.get('window').width * 0.9);
const PLACEHOLDER = '#94a3b8';

// Keeps only the 10 digits of an Indian mobile number ("+91 98765 43210" -> "9876543210").
function cleanPhone(text) {
  let digits = text.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}

/**
 * Side panel used for both adding and editing.
 * fields: [{ key, label, placeholder?, required?, phone?, caps? }]
 * value: the record being edited ({} when adding)
 * onDelete: pass it only when editing something that can be removed
 */
export default function EditDrawer({ visible, title, fields, value, onSave, onDelete, onClose }) {
  const [draft, setDraft] = useState(value);
  const [errors, setErrors] = useState({});
  const slide = useRef(new Animated.Value(PANEL_W)).current;

  useEffect(() => {
    if (visible) {
      setDraft(value);
      setErrors({});
      slide.setValue(PANEL_W);
      Animated.timing(slide, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const setField = (key, text) => setDraft((d) => ({ ...d, [key]: text }));

  const save = () => {
    const clean = {};
    const found = {};
    for (const f of fields) {
      const raw = (draft?.[f.key] ?? '').trim();
      const v = f.phone ? cleanPhone(raw) : raw;
      clean[f.key] = v;
      if (f.required && !v) {
        found[f.key] = `${f.label} is required`;
      } else if (f.phone && v && !/^[6-9]\d{9}$/.test(v)) {
        found[f.key] = 'Enter a 10-digit mobile number';
      }
    }
    setErrors(found);
    if (Object.keys(found).length === 0) onSave({ ...draft, ...clean });
  };

  const confirmDelete = () => {
    Alert.alert('Remove this student?', 'Their parents will stop getting updates.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View style={[styles.panel, { transform: [{ translateX: slide }] }]}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.head}>
              <Text style={styles.title}>{title}</Text>
              <Pressable onPress={onClose} hitSlop={10}>
                <Text style={styles.close}>×</Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.body}
              contentContainerStyle={styles.bodyContent}
              keyboardShouldPersistTaps="handled"
            >
              {fields.map((f, i) => (
                <View key={f.key} style={styles.field}>
                  <Text style={styles.label}>
                    {f.label}
                    {f.required ? <Text style={styles.star}> *</Text> : null}
                  </Text>
                  <TextInput
                    style={[styles.input, errors[f.key] && styles.inputError]}
                    value={draft?.[f.key] ?? ''}
                    onChangeText={(text) => setField(f.key, text)}
                    placeholder={f.placeholder}
                    placeholderTextColor={PLACEHOLDER}
                    keyboardType={f.phone ? 'phone-pad' : 'default'}
                    maxLength={f.phone ? 15 : undefined}
                    autoCapitalize={f.phone ? 'none' : f.caps ?? 'words'}
                    autoFocus={i === 0}
                  />
                  {errors[f.key] ? <Text style={styles.error}>{errors[f.key]}</Text> : null}
                </View>
              ))}
            </ScrollView>

            <View style={styles.actions}>
              {onDelete ? (
                <Pressable onPress={confirmDelete} style={[styles.btn, styles.btnDanger]}>
                  <Text style={styles.btnDangerText}>Remove</Text>
                </Pressable>
              ) : null}
              <View style={{ flex: 1 }} />
              <Pressable onPress={onClose} style={[styles.btn, styles.btnGhost]}>
                <Text style={styles.btnGhostText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={save} style={[styles.btn, styles.btnPrimary]}>
                <Text style={styles.btnPrimaryText}>Save</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(15, 42, 68, 0.45)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: PANEL_W,
    backgroundColor: colors.card,
    shadowColor: colors.navy,
    shadowOpacity: 0.15,
    shadowRadius: 30,
    shadowOffset: { width: -10, height: 0 },
    elevation: 10,
    paddingTop: 50,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  title: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  close: {
    color: colors.muted,
    fontSize: 26,
    lineHeight: 26,
    paddingHorizontal: 6,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 20,
    gap: 16,
  },
  field: {},
  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  star: {
    color: colors.teal,
  },
  input: {
    height: 44,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.ink,
  },
  inputError: {
    borderColor: '#dc2626',
  },
  error: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: '#fbfcfe',
  },
  btn: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhost: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
  },
  btnGhostText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  btnDanger: {
    paddingHorizontal: 4,
  },
  btnDangerText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '700',
  },
  btnPrimary: {
    backgroundColor: colors.navy,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});