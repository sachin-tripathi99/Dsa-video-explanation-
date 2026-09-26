class Solution {
    public boolean checkInclusion(String s1, String s2) {
        int k = s1.length(), n = s2.length();
        if (k > n) return false;
        int[] need = new int[26], have = new int[26];
        for (char c : s1.toCharArray()) need[c - 'a']++;
        for (int r = 0; r < n; r++) {
            have[s2.charAt(r) - 'a']++;                       // one in
            if (r >= k) have[s2.charAt(r - k) - 'a']--;       // one out
            if (r >= k - 1 && Arrays.equals(need, have)) return true;
        }
        return false;
    }
}
