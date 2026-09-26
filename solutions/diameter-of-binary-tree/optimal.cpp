class Solution {
    int best = 0;
    int height(TreeNode* n) {
        if (!n) return 0;
        int a = height(n->left), b = height(n->right);
        best = max(best, a + b);                            // path bending at n
        return 1 + max(a, b);                               // only one branch goes up
    }
public:
    int diameterOfBinaryTree(TreeNode* root) {
        height(root);
        return best;
    }
};
