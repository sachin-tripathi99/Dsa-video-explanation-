class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> window = new HashSet<>();
        int l = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            while (window.contains(s.charAt(r))) window.remove(s.charAt(l++));
            window.add(s.charAt(r));
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}
