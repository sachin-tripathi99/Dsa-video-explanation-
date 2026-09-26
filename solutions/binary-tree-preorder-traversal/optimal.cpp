class Solution {
public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> out;
        TreeNode* cur = root;
        while (cur) {
            if (!cur->left) { out.push_back(cur->val); cur = cur->right; continue; }
            TreeNode* pre = cur->left;
            while (pre->right && pre->right != cur) pre = pre->right;   // rightmost of left subtree
            if (!pre->right) {
                pre->right = cur;                           // thread back to cur
                out.push_back(cur->val);                    // pre-order: visit on the way down
                cur = cur->left;
            } else {
                pre->right = nullptr;                       // remove the thread
                cur = cur->right;
            }
        }
        return out;
    }
};
