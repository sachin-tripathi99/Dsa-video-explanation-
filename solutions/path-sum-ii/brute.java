class Solution {
    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        List<List<Integer>> all = new ArrayList<>(), out = new ArrayList<>();
        collect(root, new ArrayList<>(), all);
        for (List<Integer> p : all) {
            int s = 0;
            for (int x : p) s += x;
            if (s == targetSum) out.add(p);
        }
        return out;
    }

    private void collect(TreeNode n, List<Integer> path, List<List<Integer>> all) {
        if (n == null) return;
        path.add(n.val);
        if (n.left == null && n.right == null) all.add(new ArrayList<>(path));   // every leaf path
        collect(n.left, path, all);
        collect(n.right, path, all);
        path.remove(path.size() - 1);
    }
}
