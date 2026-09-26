class Solution {
    public List<Integer> findAnagrams(String s, String p) {
        List<Integer> out = new ArrayList<>();
        int k = p.length();
        char[] want = p.toCharArray();
        Arrays.sort(want);
        for (int i = 0; i + k <= s.length(); i++) {
            char[] w = s.substring(i, i + k).toCharArray();
            Arrays.sort(w);
            if (Arrays.equals(w, want)) out.add(i);
        }
        return out;
    }
}
