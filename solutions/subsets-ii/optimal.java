class Solution {
    private final List<List<Integer>> out = new ArrayList<>();

    public List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums);
        go(nums, 0, new ArrayList<>());
        return out;
    }

    private void go(int[] nums, int start, List<Integer> path) {
        out.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;   // same value, same depth
            path.add(nums[i]);
            go(nums, i + 1, path);
            path.remove(path.size() - 1);
        }
    }
}
