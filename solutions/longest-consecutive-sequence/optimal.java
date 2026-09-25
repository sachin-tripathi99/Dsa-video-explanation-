class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int x : nums) set.add(x);
        int best = 0;
        for (int x : set) {
            if (x != Integer.MIN_VALUE && set.contains(x - 1)) continue;   // not the start of a run
            int length = 1;
            while (x + length > x && set.contains(x + length)) length++;   // guard against overflow
            best = Math.max(best, length);
        }
        return best;
    }
}
