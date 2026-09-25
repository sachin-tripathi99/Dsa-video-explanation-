class Solution {
    public boolean isIsomorphic(String s, String t) {
        Map<Character, Character> st = new HashMap<>(), ts = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            char a = s.charAt(i), b = t.charAt(i);
            if (st.containsKey(a) && st.get(a) != b) return false;   // a already maps elsewhere
            if (ts.containsKey(b) && ts.get(b) != a) return false;   // b already taken
            st.put(a, b);
            ts.put(b, a);
        }
        return true;
    }
}
