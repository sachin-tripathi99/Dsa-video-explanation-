class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Set<List<Integer>> found = new HashSet<>();
        for (int i = 0; i < nums.length; i++) {
            Set<Integer> seen = new HashSet<>();
            for (int j = i + 1; j < nums.length; j++) {
                int need = -nums[i] - nums[j];
                if (seen.contains(need)) {
                    List<Integer> t = Arrays.asList(nums[i], nums[j], need);
                    Collections.sort(t);
                    found.add(t);
                }
                seen.add(nums[j]);
            }
        }
        return new ArrayList<>(found);
    }
}
