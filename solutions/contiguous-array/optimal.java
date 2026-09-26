class Solution {
    public int findMaxLength(int[] nums) {
        Map<Integer, Integer> first = new HashMap<>();
        first.put(0, -1);                          // balance 0 before the array starts
        int run = 0, best = 0;
        for (int i = 0; i < nums.length; i++) {
            run += nums[i] == 1 ? 1 : -1;
            Integer f = first.get(run);
            if (f != null) best = Math.max(best, i - f);
            else first.put(run, i);                // keep only the first index
        }
        return best;
    }
}
