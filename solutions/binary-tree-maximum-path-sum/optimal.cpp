class Solution {
    int best = INT_MIN;
    int gain(TreeNode* n) {
        if (!n) return 0;
        int a = max(0, gain(n->left)), b = max(0, gain(n->right));   // drop negative branches
        best = max(best, n->val + a + b);                   // path bending at n
        return n->val + max(a, b);                          // one branch goes up
    }
public:
    int maxPathSum(TreeNode* root) {
        gain(root);
        return best;
    }
};
