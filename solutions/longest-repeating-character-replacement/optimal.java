class Solution {
    public int characterReplacement(String s, int k) {
        int[] count = new int[26];
        int l = 0, maxf = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            maxf = Math.max(maxf, ++count[s.charAt(r) - 'A']);
            while (r - l + 1 - maxf > k) count[s.charAt(l++) - 'A']--;   // too many changes needed
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}
