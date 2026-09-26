class Solution {
    int down(TreeNode* n) {                                 // best downward path, recomputed each time
        if (!n) return 0;
        return n->val + max(0, max(down(n->left), down(n->right)));
    }
public:
    int maxPathSum(TreeNode* root) {
        if (!root) return INT_MIN;
        int here = root->val + max(0, down(root->left)) + max(0, down(root->right));   // root as the top
        return max(here, max(maxPathSum(root->left), maxPathSum(root->right)));
    }
};
