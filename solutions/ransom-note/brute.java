class Solution {
    public boolean canConstruct(String ransomNote, String magazine) {
        List<Character> letters = new ArrayList<>();
        for (char c : magazine.toCharArray()) letters.add(c);
        for (char c : ransomNote.toCharArray()) {
            int idx = letters.indexOf(c);            // scan the magazine
            if (idx < 0) return false;
            letters.remove(idx);                     // use it up
        }
        return true;
    }
}
