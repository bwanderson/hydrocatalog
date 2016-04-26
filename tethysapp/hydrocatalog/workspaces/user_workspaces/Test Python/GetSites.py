# Example of calling GetSiteInfoObject from a WaterOneFlow web service
from suds.client import Client

# Create a new object named "wsdlservice" for calling the web
# service methods using the suds client module
# NWIS = Client('http://hydroportal.cuahsi.org/nwisuv/cuahsi_1_1.asmx?WSDL').service

wsdlservice = Client('http://worldwater.byu.edu/app/index.php/default/services/cuahsi_1_1.asmx?WSDL').service

# response = NWIS.GetSiteInfoObject('NWISUV:10109000')

sites = wsdlservice.GetSitesObject('')
siteCount = len(sites.site)

print 'There are '+str(siteCount)+' sites.\n'

for i in sites.site:
    print (i.siteInfo.siteCode[0].value +': '+i.siteInfo.siteName)







#
# # Create the inputs needed for the web service call
# wsdlURL = 'http://data.iutahepscor.org/loganriverwof/cuahsi_1_1.asmx?WSDL'
# networkCode = 'iutah'
#
# # Create a new object named "service" for calling the web service methods
# service = Client(wsdlURL).service
#
# # Get the list of Sites from the service
# # --------------------------------------
# print 'Get the list of sites.'
# print '----------------------'
# sitesResult = service.GetSitesObject('')
# siteCount = len(sitesResult.site)
# print 'In the selected service there are ' + str(siteCount) + ' Sites.\n'
# for x in sitesResult.site:
#     print (x.siteInfo.siteCode[0].value + ': ' + x.siteInfo.siteName)
#
#
# # Get SiteInfo for a selected Site
# # ---------------------------------------
# print '\nGet information about a selected site.'
# print '----------------------------------------'
# siteCode = 'LR_Mendon_AA'
# siteInfoResult = service.GetSiteInfoObject(networkCode + ':' + siteCode)
# siteName = siteInfoResult.site[0].siteInfo.siteName
# numSeries = len(siteInfoResult.site[0].seriesCatalog[0].series)
# print ('At the ' + siteName + ' Site there are ' + str(numSeries) +
#        ' measured variables.\n')
# for x in siteInfoResult.site[0].seriesCatalog[0].series:
#     print (x.variable.variableCode[0].value + ': ' + x.variable.variableName)
#
#
# # Get the list of Variables from the service
# # --------------------------------------
# print '\nGet the list of Variables.'
# print '--------------------------'
# variablesResult = service.GetVariablesObject('')
# variablesCount = len(variablesResult.variables.variable)
# print 'In the selected service there are ' + str(variablesCount) + ' Variables.\n'
# for x in variablesResult.variables.variable:
#     print (x.variableCode[0].value + ': ' + x.variableName)
#
#
# # Get VariableInfo for a particular Variable
# # ------------------------------------------
# print '\nSome information about a selected variable:'
# print '---------------------------------------------'
# variableCode = 'ODO'
# variableInfoResult = service.GetVariableInfoObject(networkCode + ':' + variableCode)
# variableName = variableInfoResult.variables.variable[0].variableName
# dataType = variableInfoResult.variables.variable[0].dataType
# units = variableInfoResult.variables.variable[0].unit.unitName
# timeSupport = variableInfoResult.variables.variable[0].timeScale.timeSupport
# timeSupportUnits = variableInfoResult.variables.variable[0].timeScale.unit.unitName
# print 'VariableName: ' + variableName
# print 'DataType: ' + dataType
# print 'Units: ' + units
# print 'TimeSupport: ' + str(timeSupport) + ' ' + timeSupportUnits + ' values\n'
#
# print 'Done!'
