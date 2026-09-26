class Solution {
    public boolean hasPathSum(TreeNode root, int targetSum) {
        List<List<Integer>> paths = new ArrayList<>();
        collect(root, new ArrayList<>(), paths);
        for (List<Integer> p : paths) {
            int s = 0;
            for (int x : p) s += x;
            if (s == targetSum) return true;
        }
        return false;
    }

    private void collect(TreeNode node, List<Integer> path, List<List<Integer>> paths) {
        if (node == null) return;
        path.add(node.val);
        if (node.left == null && node.right == null) paths.add(new ArrayList<>(path));   // copy at each leaf
        collect(node.left, path, paths);
        collect(node.right, path, paths);
        path.remove(path.size() - 1);
    }
}
