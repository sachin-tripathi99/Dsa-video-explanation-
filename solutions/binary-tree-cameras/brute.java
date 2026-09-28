class Solution {
    private final List<TreeNode> nodes = new ArrayList<>();
    private final Map<TreeNode, TreeNode> parent = new HashMap<>();

    public int minCameraCover(TreeNode root) {
        collect(root, null);
        int n = nodes.size(), best = n;
        for (int mask = 0; mask < (1 << n); mask++) {       // every set of camera nodes
            if (Integer.bitCount(mask) >= best) continue;
            Set<TreeNode> seen = new HashSet<>();
            for (int i = 0; i < n; i++) if ((mask >> i & 1) == 1) {
                TreeNode x = nodes.get(i);
                seen.add(x);
                if (parent.get(x) != null) seen.add(parent.get(x));
                if (x.left != null) seen.add(x.left);
                if (x.right != null) seen.add(x.right);
            }
            if (seen.size() == n) best = Integer.bitCount(mask);
        }
        return best;
    }

    private void collect(TreeNode x, TreeNode p) {
        if (x == null) return;
        nodes.add(x);
        parent.put(x, p);
        collect(x.left, x);
        collect(x.right, x);
    }
}
