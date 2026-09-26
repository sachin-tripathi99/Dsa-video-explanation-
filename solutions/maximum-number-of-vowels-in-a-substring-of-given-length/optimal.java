class Solution {
    public int maxVowels(String s, int k) {
        int count = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            if (isVowel(s.charAt(r))) count++;                 // one in
            if (r >= k && isVowel(s.charAt(r - k))) count--;   // one out
            if (r >= k - 1) best = Math.max(best, count);
        }
        return best;
    }

    private boolean isVowel(char c) { return "aeiou".indexOf(c) >= 0; }
}
