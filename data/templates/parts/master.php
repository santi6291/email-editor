<?php 
ini_set('display_errors', 1);
error_reporting(E_ALL);

include_once('head.html'); 
?>
<center>
	<table border="0" cellpadding="0" cellspacing="0" height="100%" id="backgroundTable" width="100%" style="height: 100% !important;margin: 0;padding: 0;width: 100% !important;background-color: #FAFAFA">
		<tbody>
			<tr>
				<td align="center" valign="top" style="border-collapse: collapse">
					<table border="0" cellpadding="0" cellspacing="0" id="templateContainer" width="600" style="border: 1px solid #DDD;background-color: #FFF">
						<tbody>
							<tr>
								<!-- header -->
								<td align="center" valign="top" style="border-collapse: collapse" class="add-header">
									<?php
									include_once('components/header-cols-1.html');
									include_once('components/header-cols-2-left.html');
									include_once('components/header-cols-2-right.html');
									include_once('components/header-cols-3.html');
									?>
								</td>
								<!-- /header -->
							</tr>
							<tr>
								<td align="center" valign="top" style="border-collapse: collapse">
									<table border="0" cellpadding="0" cellspacing="0" id="templateBody" width="600" class="add-body">
										<tbody>
											<tr class="">
												<td id="templateSidebar" valign="top" width="200" style="border-collapse: collapse;background-color: #FFF">
													<?php include_once('components/body-sidebar.html') ?>
												</td>
												<td class="bodyContent" valign="top" style="border-collapse: collapse;background-color: #FFF">
													<!-- 
													multi column td :
													td: 
													cellPadding = 20;
													container = 400;
													colCount / ( (cellPadding * colCount) - container );
													-->
													<?php 
													include_once('components/body-content-cols-1.html');
													?>
												</td>
											</tr>
											<tr>
												<td colspan="2">
													<?php
													include_once('components/body-content-cols-2.html');
													include_once('components/body-content-cols-3.html');
													include_once('components/body-content-cols-4.html');
													?>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</center>
<?php include_once('footer.html'); ?>