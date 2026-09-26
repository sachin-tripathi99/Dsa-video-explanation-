class Solution {
    public int characterReplacement(String s, int k) {
        int best = 0;
        for (int i = 0; i < s.length(); i++) {
            int[] count = new int[26];
            int maxf = 0;
            for (int j = i; j < s.length(); j++) {
                maxf = Math.max(maxf, ++count[s.charAt(j) - 'A']);
                if (j - i + 1 - maxf <= k) best = Math.max(best, j - i + 1);
            }
        }
        return best;
    }
}
