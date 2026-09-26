class Solution {
    private final List<List<Integer>> out = new ArrayList<>();

    public List<List<Integer>> permute(int[] nums) {
        go(nums, new boolean[nums.length], new ArrayList<>());
        return out;
    }

    private void go(int[] nums, boolean[] used, List<Integer> path) {
        if (path.size() == nums.length) { out.add(new ArrayList<>(path)); return; }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true; path.add(nums[i]);              // choose
            go(nums, used, path);                           // explore
            path.remove(path.size() - 1); used[i] = false;  // un-choose
        }
    }
}
