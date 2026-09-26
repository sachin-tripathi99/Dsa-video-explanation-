class Solution {
    private final List<List<Integer>> out = new ArrayList<>();

    public List<List<Integer>> subsets(int[] nums) {
        go(nums, 0, new ArrayList<>());
        return out;
    }

    private void go(int[] nums, int start, List<Integer> path) {
        out.add(new ArrayList<>(path));                     // every node is a subset
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);                              // choose
            go(nums, i + 1, path);                          // explore
            path.remove(path.size() - 1);                   // un-choose
        }
    }
}
