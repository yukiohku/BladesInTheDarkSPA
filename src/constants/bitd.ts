/** クルーの補助入力用。キャラクターの原典データは playbooks.ts に置く。 */
export interface Option {
  id: string
  name: string
}
export const CREW_TYPES: Option[] = [
  { id: 'assassins', name: '暗殺' },
  { id: 'criminal', name: '犯罪' },
  { id: 'cult', name: 'カルト' },
  { id: 'smugglers', name: '密輸' },
  { id: 'hawkers', name: '行商' },
  { id: 'mercenaries', name: '傭兵' },
]
export const CREW_MEMBER_ROLES: Option[] = [
  '頭領',
  '副頭領',
  '補佐',
  '古株',
  '傭兵',
  '協力者',
  'その他',
].map((name, index) => ({ id: `role-${index}`, name }))
