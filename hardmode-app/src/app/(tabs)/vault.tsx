import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import { Button, Card, haptic, Label, Screen, styles, Title } from '../../components/ui';
import { formatPretty } from '../../lib/date';
import { useStore } from '../../state/store';
import { colors } from '../../theme';

export default function VaultScreen() {
  const { data, addVaultEntry, removeVaultEntry } = useStore();
  const [text, setText] = useState('');

  const save = () => {
    if (!text.trim()) return;
    addVaultEntry(text);
    haptic('success');
    setText('');
  };

  return (
    <Screen>
      <Title kicker="Proof you are hard to kill">Victory Vault</Title>
      <Text style={styles.body}>
        Log every win, every hard thing you survived. When you want to quit, come back here and remember who you are.
      </Text>

      <Card>
        <Label>New victory</Label>
        <TextInput
          style={[styles.input, { minHeight: 90, textAlignVertical: 'top' }]}
          placeholder="What hard thing did you do?"
          placeholderTextColor={colors.textFaint}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={400}
        />
        <Button title="Lock it in (+15 XP)" icon="trophy" onPress={save} disabled={!text.trim()} />
      </Card>

      {data.vault.map((v) => (
        <Card key={v.id}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Label color={colors.gold}>{formatPretty(v.date)}</Label>
            <Pressable
              hitSlop={10}
              onPress={() =>
                Alert.alert('Delete this victory?', undefined, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => removeVaultEntry(v.id) },
                ])
              }>
              <Ionicons name="trash-outline" size={16} color={colors.textFaint} />
            </Pressable>
          </View>
          <Text style={[styles.body, { color: colors.text }]}>{v.text}</Text>
        </Card>
      ))}

      {data.vault.length === 0 ? (
        <Text style={[styles.body, { textAlign: 'center', marginTop: 12 }]}>Your vault is empty. Go earn something.</Text>
      ) : null}
    </Screen>
  );
}
