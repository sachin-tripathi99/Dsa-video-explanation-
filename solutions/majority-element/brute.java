class Solution {
    public int majorityElement(int[] nums) {
        for (int x : nums) {
            int count = 0;
            for (int y : nums) if (y == x) count++;
            if (count > nums.length / 2) return x;
        }
        return -1;
    }
}
