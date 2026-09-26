class Solution {
    public int maxVowels(String s, int k) {
        int best = 0;
        for (int i = 0; i + k <= s.length(); i++) {
            int c = 0;
            for (int j = i; j < i + k; j++) if ("aeiou".indexOf(s.charAt(j)) >= 0) c++;
            best = Math.max(best, c);
        }
        return best;
    }
}
