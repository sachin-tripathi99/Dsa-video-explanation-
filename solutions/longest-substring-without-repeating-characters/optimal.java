class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> last = new HashMap<>();
        int l = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            Integer prev = last.get(c);
            if (prev != null && prev >= l) l = prev + 1;    // repeat inside the window: jump past it
            last.put(c, r);
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}
