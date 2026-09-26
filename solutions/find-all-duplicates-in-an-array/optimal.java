class Solution {
    public List<Integer> findDuplicates(int[] nums) {
        List<Integer> out = new ArrayList<>();
        for (int x : nums) {
            int j = Math.abs(x) - 1;
            if (nums[j] < 0) out.add(Math.abs(x));   // seen before
            else nums[j] = -nums[j];                 // mark as seen
        }
        return out;
    }
}
