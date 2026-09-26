class Solution {
    public boolean checkInclusion(String s1, String s2) {
        int k = s1.length();
        char[] want = s1.toCharArray();
        Arrays.sort(want);
        for (int i = 0; i + k <= s2.length(); i++) {
            char[] w = s2.substring(i, i + k).toCharArray();
            Arrays.sort(w);
            if (Arrays.equals(w, want)) return true;
        }
        return false;
    }
}
