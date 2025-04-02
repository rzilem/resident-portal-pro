
import { supabase } from '@/lib/supabase';

/**
 * Service for tracking proposal views and engagement
 */
export const proposalTrackingService = {
  /**
   * Track a proposal view
   * @param proposalId The ID of the proposal
   * @param viewerEmail Email of the viewer
   * @param viewerIp Optional IP address of the viewer
   * @returns Promise with tracking result
   */
  async trackProposalView(
    proposalId: string, 
    viewerEmail: string, 
    viewerIp?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`Tracking view for proposal ${proposalId} by ${viewerEmail}`);
      
      // First update the proposal's view count and last viewed timestamp
      const { error: updateError } = await supabase
        .from('proposals')
        .update({ 
          viewcount: supabase.rpc('increment', { row_id: proposalId, table: 'proposals' }),
          lastviewedat: new Date().toISOString()
        })
        .eq('id', proposalId);
      
      if (updateError) {
        console.error("Error updating proposal view count:", updateError);
        return { success: false, error: updateError.message };
      }
      
      // Then record the specific view event
      const { error: logError } = await supabase
        .from('proposal_views')
        .insert([{
          proposalid: proposalId,
          vieweremail: viewerEmail,
          viewerip: viewerIp || null,
          viewedat: new Date().toISOString(),
          totaltimespent: 0 // Will be updated as the user views the proposal
        }]);
      
      if (logError) {
        console.error("Error logging proposal view:", logError);
        return { success: false, error: logError.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error in trackProposalView:", error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Update time spent on a proposal
   * @param proposalId The ID of the proposal
   * @param viewerEmail Email of the viewer
   * @param timeSpent Time spent in seconds
   * @returns Promise with update result
   */
  async updateViewTime(
    proposalId: string, 
    viewerEmail: string, 
    timeSpent: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get the latest view record for this user and proposal
      const { data: viewRecords, error: fetchError } = await supabase
        .from('proposal_views')
        .select('id, totaltimespent')
        .eq('proposalid', proposalId)
        .eq('vieweremail', viewerEmail)
        .order('viewedat', { ascending: false })
        .limit(1);
      
      if (fetchError) {
        console.error("Error fetching proposal view record:", fetchError);
        return { success: false, error: fetchError.message };
      }
      
      if (!viewRecords || viewRecords.length === 0) {
        console.error("No view record found to update time spent");
        return { success: false, error: "No view record found" };
      }
      
      // Update the time spent
      const { error: updateError } = await supabase
        .from('proposal_views')
        .update({ 
          totaltimespent: timeSpent 
        })
        .eq('id', viewRecords[0].id);
      
      if (updateError) {
        console.error("Error updating time spent:", updateError);
        return { success: false, error: updateError.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error in updateViewTime:", error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Track viewing of a specific proposal section
   * @param proposalId The ID of the proposal
   * @param sectionId The ID of the section
   * @param viewerEmail Email of the viewer
   * @param timeSpent Time spent on this section in seconds
   * @returns Promise with tracking result
   */
  async trackSectionView(
    proposalId: string, 
    sectionId: string, 
    viewerEmail: string, 
    timeSpent: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Record the section view
      const { error } = await supabase
        .from('section_views')
        .insert([{
          proposalid: proposalId,
          sectionid: sectionId,
          vieweremail: viewerEmail,
          viewedat: new Date().toISOString(),
          timespent: timeSpent
        }]);
      
      if (error) {
        console.error("Error logging section view:", error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error in trackSectionView:", error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Get proposal view analytics
   * @param proposalId The ID of the proposal
   * @returns Promise with analytics data
   */
  async getProposalAnalytics(proposalId: string): Promise<{
    totalViews: number;
    uniqueViewers: number;
    averageTimeSpent: number;
    sectionEngagement: { sectionId: string; views: number; avgTimeSpent: number }[];
    viewTimeline: { date: string; count: number }[];
    error?: string;
  }> {
    try {
      // Get all views for this proposal
      const { data: views, error: viewsError } = await supabase
        .from('proposal_views')
        .select('*')
        .eq('proposalid', proposalId);
      
      if (viewsError) {
        console.error("Error fetching proposal views:", viewsError);
        return {
          totalViews: 0,
          uniqueViewers: 0,
          averageTimeSpent: 0,
          sectionEngagement: [],
          viewTimeline: [],
          error: viewsError.message
        };
      }
      
      // Get all section views for this proposal
      const { data: sectionViews, error: sectionsError } = await supabase
        .from('section_views')
        .select('*')
        .eq('proposalid', proposalId);
      
      if (sectionsError) {
        console.error("Error fetching section views:", sectionsError);
        return {
          totalViews: views?.length || 0,
          uniqueViewers: new Set(views?.map(v => v.vieweremail)).size,
          averageTimeSpent: views?.reduce((acc, view) => acc + (view.totaltimespent || 0), 0) / (views?.length || 1),
          sectionEngagement: [],
          viewTimeline: [],
          error: sectionsError.message
        };
      }
      
      // Calculate unique viewers
      const uniqueViewers = new Set(views?.map(v => v.vieweremail)).size;
      
      // Calculate average time spent
      const totalTimeSpent = views?.reduce((acc, view) => acc + (view.totaltimespent || 0), 0) || 0;
      const averageTimeSpent = totalTimeSpent / (views?.length || 1);
      
      // Calculate section engagement
      const sectionEngagement = [];
      if (sectionViews && sectionViews.length > 0) {
        const sectionMap = new Map();
        
        sectionViews.forEach(view => {
          if (!sectionMap.has(view.sectionid)) {
            sectionMap.set(view.sectionid, { views: 0, totalTime: 0 });
          }
          
          const sectionData = sectionMap.get(view.sectionid);
          sectionData.views += 1;
          sectionData.totalTime += (view.timespent || 0);
          sectionMap.set(view.sectionid, sectionData);
        });
        
        sectionMap.forEach((data, sectionId) => {
          sectionEngagement.push({
            sectionId,
            views: data.views,
            avgTimeSpent: data.totalTime / data.views
          });
        });
      }
      
      // Calculate view timeline
      const viewTimeline = [];
      if (views && views.length > 0) {
        const dateMap = new Map();
        
        views.forEach(view => {
          const date = new Date(view.viewedat).toISOString().split('T')[0];
          
          if (!dateMap.has(date)) {
            dateMap.set(date, 0);
          }
          
          dateMap.set(date, dateMap.get(date) + 1);
        });
        
        // Convert the map to an array and sort by date
        Array.from(dateMap.entries())
          .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
          .forEach(([date, count]) => {
            viewTimeline.push({ date, count });
          });
      }
      
      return {
        totalViews: views?.length || 0,
        uniqueViewers,
        averageTimeSpent,
        sectionEngagement,
        viewTimeline
      };
    } catch (error) {
      console.error("Error in getProposalAnalytics:", error);
      return {
        totalViews: 0,
        uniqueViewers: 0,
        averageTimeSpent: 0,
        sectionEngagement: [],
        viewTimeline: [],
        error: error.message
      };
    }
  }
};
