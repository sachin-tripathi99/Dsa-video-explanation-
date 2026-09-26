class Solution {
    public int findMaxLength(int[] nums) {
        int best = 0;
        for (int i = 0; i < nums.length; i++) {
            int bal = 0;
            for (int j = i; j < nums.length; j++) {
                bal += nums[j] == 1 ? 1 : -1;
                if (bal == 0) best = Math.max(best, j - i + 1);
            }
        }
        return best;
    }
}
