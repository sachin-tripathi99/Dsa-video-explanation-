class Solution {
    unordered_map<int, int> pos;
    int i = 0;                                              // next root in preorder
    TreeNode* build(vector<int>& pre, int lo, int hi) {     // inorder range [lo, hi]
        if (lo > hi) return nullptr;
        TreeNode* root = new TreeNode(pre[i++]);
        int m = pos[root->val];
        root->left = build(pre, lo, m - 1);
        root->right = build(pre, m + 1, hi);
        return root;
    }
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        for (int k = 0; k < (int)inorder.size(); k++) pos[inorder[k]] = k;
        return build(preorder, 0, inorder.size() - 1);
    }
};
