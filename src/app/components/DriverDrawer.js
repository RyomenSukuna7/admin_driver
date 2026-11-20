import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { colors } from '../../theme';

const PANEL_W = Math.min(420, Dimensions.get('window').width * 0.9);

export default function DriverDrawer({ visible, value, onSave, onClose }) {
  const [draft, setDraft] = useState(value);
  const slide = useRef(new Animated.Value(PANEL_W)).current;

  useEffect(() => {
    if (visible) {
      setDraft(value);
      slide.setValue(PANEL_W);
      Animated.timing(slide, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <Animated.View style={[styles.panel, { transform: [{ translateX: slide }] }]}>
          <View style={styles.head}>
            <Text style={styles.title}>Edit driver</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.close}>×</Text>
            </Pressable>
          </View>

          <View style={styles.body}>
            <Text style={styles.label}>Driver name</Text>
            <TextInput
              style={styles.input}
              value={draft}
              onChangeText={setDraft}
              placeholder="Type the driver's full name"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.actions}>
            <Pressable onPress={onClose} style={[styles.btn, styles.btnGhost]}>
              <Text style={styles.btnGhostText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onSave(draft.trim())}
              style={[styles.btn, styles.btnPrimary]}
            >
              <Text style={styles.btnPrimaryText}>Save changes</Text>
            </Pressable>
          </View>
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
    padding: 20,
  },
  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  btnPrimary: {
    backgroundColor: colors.navy,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});